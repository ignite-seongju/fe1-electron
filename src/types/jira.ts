// Jira API 관련 타입 정의

export interface JiraIssueDetail {
  id: string
  key: string
  self: string
  fields: {
    summary: string
    status: {
      name: string
      id: string
      statusCategory: {
        key: string
        name: string
      }
    }
    assignee: {
      accountId: string
      displayName: string
      emailAddress?: string
    } | null
    priority: {
      name: string
      id: string
    }
    issuetype: {
      name: string
      id: string
    }
    project: {
      key: string
      name: string
    }
    created: string
    updated: string
    description?: any
    duedate?: string
    customfield_10015?: string
    issuelinks?: JiraIssueLink[]
    timetracking?: {
      originalEstimate?: string
      remainingEstimate?: string
      originalEstimateSeconds?: number
      remainingEstimateSeconds?: number
    }
    timeoriginalestimate?: number // 원본 예상 시간 (초 단위)
    customfield_10306?: string // HMG Jira 티켓 URL
  }
}

export interface JiraIssueLink {
  id: string
  type: {
    name: string
    inward: string
    outward: string
  }
  outwardIssue?: {
    key: string
    fields: {
      status: {
        name: string
      }
      summary: string
    }
  }
  inwardIssue?: {
    key: string
    fields: {
      status: {
        name: string
      }
      summary: string
    }
  }
}

export interface JiraApiResponse {
  issues: JiraIssueDetail[]
  total: number
  maxResults: number
  startAt: number
}

export interface JiraBoardIds {
  FEHG: number
  KQ: number
  HB: number
  AUTOWAY: number
}

export interface SyncResult {
  success: boolean
  message: string
  syncedIssues: number
  errors: string[]
  details: {
    fehgIssues: JiraIssueDetail[]
    linkedKqIssues: JiraIssueDetail[]
  }
}

export interface JiraIssueUpdatePayload {
  fields: {
    summary?: string
    duedate?: string | null
    customfield_10015?: string | null // 시작일
    assignee?: {
      accountId: string
      displayName?: string
      emailAddress?: string
    } | null
    timetracking?: {
      originalEstimate?: string
      remainingEstimate?: string
    }
    customfield_10020?: number | string | number[] | null // 스프린트 필드 (ID 배열 또는 단일 값)
  }
}

export type SyncType = 'FEHG_TO_KQ' | 'FEHG_TO_HB' | 'FEHG_TO_AUTOWAY'

export interface SyncFieldConfig {
  description: string
  fields: readonly string[]
}

export interface SyncUpdateResult {
  sourceKey: string
  sourceSummary: string
  targetKey: string
  status: 'success' | 'failed'
  error?: string
}

// FEHG 에픽 관련 타입
export interface FEHGEpicIssue {
  id: string
  key: string
  self: string
  fields: {
    summary: string
    status: {
      name: string
      id: string
    }
    duedate?: string
    customfield_10015?: string // FEHG의 커스텀 필드
    customfield_10306?: string // AUTOWAY 에픽 링크 필드
    description?: any
    project: {
      key: string
      name: string
    }
  }
}

// HmgJira 관련 타입 (AUTOWAY 프로젝트)
export interface HmgJiraIssue {
  id: string
  key: string
  self: string
  fields: {
    summary: string
    status: {
      name: string
    }
    duedate?: string
    customfield_11209?: string
  }
}

export interface HmgJiraCreatePayload {
  fields: {
    project: { key: string }
    issuetype: { name: string }
    summary: string
    description?: string
    duedate?: string
    assignee?: { name: string }
    reporter?: { name: string }
    customfield_11209?: string // HmgJira AUTOWAY 프로젝트의 커스텀 필드
    customfield_10100?: string // Start Date
    customfield_10101?: string // End Date
    customfield_10014?: string // Epic Link 필드
    customfield_10002?: string // HmgJira AUTOWAY 에픽 링크 필드
    timetracking?: {
      originalEstimate?: string
      remainingEstimate?: string
      originalEstimateSeconds?: number
      remainingEstimateSeconds?: number
    }
  }
}
