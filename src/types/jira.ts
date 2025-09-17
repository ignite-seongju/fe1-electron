// Jira API 관련 타입 정의

export interface JiraIssueDetail {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    status: {
      name: string;
      id: string;
      statusCategory: {
        key: string;
        name: string;
      };
    };
    assignee: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    } | null;
    priority: {
      name: string;
      id: string;
    };
    issuetype: {
      name: string;
      id: string;
    };
    project: {
      key: string;
      name: string;
    };
    created: string;
    updated: string;
    description?: any;
    issuelinks?: JiraIssueLink[];
  };
}

export interface JiraIssueLink {
  id: string;
  type: {
    name: string;
    inward: string;
    outward: string;
  };
  outwardIssue?: {
    key: string;
    fields: {
      status: {
        name: string;
      };
      summary: string;
    };
  };
  inwardIssue?: {
    key: string;
    fields: {
      status: {
        name: string;
      };
      summary: string;
    };
  };
}

export interface JiraApiResponse {
  issues: JiraIssueDetail[];
  total: number;
  maxResults: number;
  startAt: number;
}

export interface JiraBoardIds {
  FEHG: number;
  KQ: number;
  HB: number;
  AUTOWAY: number;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncedIssues: number;
  errors: string[];
  details: {
    fehgIssues: JiraIssueDetail[];
    linkedKqIssues: JiraIssueDetail[];
  };
}

export interface JiraIssueUpdatePayload {
  fields: {
    summary?: string;
    duedate?: string | null;
    customfield_10015?: string | null; // 시작일
    assignee?: {
      accountId: string;
      displayName?: string;
      emailAddress?: string;
    } | null;
    timetracking?: {
      originalEstimate?: string;
      remainingEstimate?: string;
    };
    customfield_10020?: number | string | number[] | null; // 스프린트 필드 (ID 배열 또는 단일 값)
  };
}

export type SyncType = 'FEHG_TO_KQ' | 'FEHG_TO_HB' | 'FEHG_TO_AUTOWAY';

export interface SyncFieldConfig {
  description: string;
  fields: readonly string[];
}

export interface SyncUpdateResult {
  sourceKey: string;
  sourceSummary: string;
  targetKey: string;
  status: 'success' | 'failed';
  error?: string;
}
