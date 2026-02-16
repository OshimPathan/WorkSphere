export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketType {
    ISSUE = 'ISSUE',
    BUG = 'BUG',
    FEATURE_REQUEST = 'FEATURE_REQUEST',
    SUPPORT = 'SUPPORT'
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: Priority;
    type: TicketType;
    organizationId: string;
    createdById: string;
    createdBy?: {
        id: string;
        name: string;
        email?: string;
    };
    assignedToId?: string;
    assignedTo?: {
        id: string;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
    _count?: {
        comments: number;
    };
}

export interface TicketComment {
    id: string;
    content: string;
    ticketId: string;
    userId: string;
    user: {
        id: string;
        name: string;
    };
    createdAt: string;
}
