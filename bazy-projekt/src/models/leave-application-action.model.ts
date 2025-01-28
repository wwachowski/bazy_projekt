export interface LeaveApplicationAction {
  ID: number;
  SOURCE_STATUS_ID: number;
  DESTINATION_STATUS_ID: number;
  NAME: string;
  COLOR: string;
  ACTION_INDEX: number;
  DESCRIPTION: string;
  AVAILABILITY_ROLE: 'ALL' | 'OWNER' | 'ASSIGNEE';
}
