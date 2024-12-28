// types/expo-notifications.d.ts
declare module 'expo-notifications' {
    export interface NotificationContent {
      title: string;
      body: string;
      data?: Record<string, unknown>;
      sticky?: boolean;
      autoDismiss?: boolean;
    }
  
    export interface NotificationRequestInput {
      content: NotificationContent;
      trigger: null | any;
      identifier?: string;
    }
  
    export function dismissAllNotificationsAsync(): Promise<void>;
    export function scheduleNotificationAsync(request: NotificationRequestInput): Promise<string>;
    export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  }