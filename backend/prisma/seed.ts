import { PrismaClient, Role, Priority, TaskStatus, LeaveStatus, LeaveType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ==========================================
// CONFIGURATION: Customize your dataset here
// ==========================================
const ORG_NAME = 'My Custom Corp';
const ORG_DOMAIN = 'custom.com';

const ADMIN_EMAIL = 'admin@custom.com';
const HR_EMAIL = 'hr@custom.com';
const EMPLOYEE_EMAIL = 'employee@custom.com';
const DEFAULT_PASSWORD = 'password123'; // will be hashed automatically

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Organization
    const demoOrg = await prisma.organization.create({
        data: {
            name: ORG_NAME,
            domain: ORG_DOMAIN
        }
    });
    console.log(`Created Organization: ${ORG_NAME}`);

    // 2. Create Users
    const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const admin = await prisma.user.create({
        data: {
            email: ADMIN_EMAIL,
            password,
            name: 'Admin User',
            role: Role.ADMIN,
            organizationId: demoOrg.id
        },
    });

    // Assign owner
    await prisma.organization.update({
        where: { id: demoOrg.id },
        data: { ownerId: admin.id }
    });

    const hr = await prisma.user.create({
        data: {
            email: HR_EMAIL,
            password,
            name: 'HR Manager',
            role: Role.HR,
            organizationId: demoOrg.id
        },
    });

    const employee = await prisma.user.create({
        data: {
            email: EMPLOYEE_EMAIL,
            password,
            name: 'John Doe',
            role: Role.EMPLOYEE,
            organizationId: demoOrg.id
        },
    });
    console.log('Created Users:', [ADMIN_EMAIL, HR_EMAIL, EMPLOYEE_EMAIL]);

    // 3. Create Department
    const engineering = await prisma.department.create({
        data: {
            name: 'Engineering',
            organizationId: demoOrg.id,
            managerId: admin.id
        }
    });

    // 4. Create Team
    const frontendTeam = await prisma.team.create({
        data: {
            name: 'Frontend Team',
            departmentId: engineering.id,
            organizationId: demoOrg.id,
            leaderId: admin.id
        }
    });

    // Assign users to team/dept
    await prisma.user.update({
        where: { id: employee.id },
        data: {
            departmentId: engineering.id,
            teamId: frontendTeam.id
        }
    });

    // 5. Create Project
    const project = await prisma.project.create({
        data: {
            name: 'Website Redesign',
            description: 'Overhaul of corporate website',
            teamId: frontendTeam.id,
            organizationId: demoOrg.id,
            leaderId: admin.id
        }
    });

    // 6. Create Task
    await prisma.task.create({
        data: {
            title: 'Setup React Project',
            description: 'Initialize Vite + React + Tailwind',
            projectId: project.id,
            organizationId: demoOrg.id,
            assignedToId: employee.id,
            createdById: admin.id,
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH
        }
    });

    // 7. Create Leave Request
    await prisma.leave.create({
        data: {
            userId: employee.id,
            organizationId: demoOrg.id,
            reason: 'Vacation',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            type: LeaveType.VACATION,
            status: LeaveStatus.PENDING
        }
    });

    // 8. Create General Channel
    const existingChannel = await prisma.channel.findFirst({
        where: { name: 'General', organizationId: demoOrg.id }
    });

    if (!existingChannel) {
        await prisma.channel.create({
            data: {
                name: 'General',
                type: 'PUBLIC',
                description: 'General discussion for everyone',
                organizationId: demoOrg.id,
                members: {
                    create: [
                        { userId: admin.id, role: 'ADMIN' },
                        { userId: employee.id, role: 'MEMBER' },
                        { userId: hr.id, role: 'MEMBER' }
                    ]
                }
            }
        });
        console.log('Created General Channel');
    }

    console.log('Seeding completed. Organization created:', demoOrg.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
