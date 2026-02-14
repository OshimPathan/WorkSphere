import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';
import clsx from 'clsx';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
    priority: string;
    project: { name: string };
    deadline: string | null;
}

const columns = [
    { id: 'TODO', title: 'To Do', color: 'bg-gray-700' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-600' },
    { id: 'REVIEW', title: 'Review', color: 'bg-yellow-600' },
    { id: 'COMPLETED', title: 'Completed', color: 'bg-green-600' },
];

// Sortable Item Component
const SortableTask = ({ task }: { task: Task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-700/50 p-4 rounded-xl border border-blue-500/50 opacity-40 h-[150px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 cursor-grab touch-none group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-blue-400 block">{task.project?.name}</span>
                <span className={clsx(
                    'w-2 h-2 rounded-full',
                    task.priority === 'CRITICAL' ? 'bg-red-500' :
                        task.priority === 'HIGH' ? 'bg-orange-500' :
                            'bg-gray-500'
                )} title={`${task.priority} Priority`} />
            </div>
            <h3 className="font-bold text-white mb-1">{task.title}</h3>
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>

            {task.deadline && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

// Column Component
const Column = ({ id, title, tasks }: { id: string, title: string, tasks: Task[] }) => {
    const { setNodeRef } = useSortable({ id: id, data: { type: 'Column', id } });

    return (
        <div className="bg-gray-800/20 rounded-xl p-4 min-h-[500px] flex flex-col">
            <h3 className="font-bold text-gray-300 mb-4 flex items-center justify-between">
                {title}
                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-400">{tasks.length}</span>
            </h3>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className="flex-1 space-y-3">
                    {tasks.map((task) => (
                        <SortableTask key={task.id} task={task} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

interface TasksProps {
    simpleView?: boolean;
}

const Tasks = ({ simpleView = false }: TasksProps) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Drag after 5px move
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            try {
                const response = await api.get(`/tasks?assignedToId=${user.id}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

    // Handle Drag End
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // Find which column we are dropping into
        // If dropping on a container (Column), use that ID.
        // If dropping on another Task, find that task's status.
        let newStatus = overId;

        // If dropping over a task, get that task's status
        const overTask = tasks.find(t => t.id === overId);
        if (overTask) {
            newStatus = overTask.status;
        }

        // Only update if status changed
        if (activeTask.status !== newStatus && columns.some(c => c.id === newStatus)) {
            // Optimistic Update
            setTasks((prev) => prev.map(t =>
                t.id === activeId ? { ...t, status: newStatus as any } : t
            ));

            try {
                await api.patch(`/tasks/${activeId}/status`, { status: newStatus });
            } catch (err) {
                console.error("Failed to update status", err);
                // Revert on failure
                setTasks((prev) => prev.map(t =>
                    t.id === activeId ? { ...t, status: activeTask.status } : t
                ));
            }
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    };

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading your tasks...</div>;

    if (simpleView) {
        return (
            <div className="space-y-2">
                {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0 mr-2">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{task.title}</h4>
                            <p className="text-xs text-gray-500 truncate">
                                {task.project?.name || 'No Project'} • {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                            </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                            ${task.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                task.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'}`}>
                            {task.priority}
                        </span>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">No pending tasks.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
            <p className="text-gray-500 mb-6">Manage your work with the Kanban board</p>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-x-auto pb-4">
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            tasks={tasks.filter(t => t.status === col.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="bg-gray-800 p-4 rounded-xl border border-blue-500 shadow-2xl cursor-grabbing w-[300px]">
                            <h3 className="font-bold text-white mb-1">{activeTask.title}</h3>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Tasks;
