# App States in WalkWays

## 1. Various States an App Can Enter

In my choice of platform, React Native apps can generally enter the following states:

1. **Active**: The app is currently in use, and the user is interacting with it.
2. **Background**: The app is not currently in use but remains running in the background, allowing it to perform operations such as data fetching. In this state, the user might be:
   - In another app
   - On the home screen
   - [Android] on another Activity (even if it was launched by your app)
3. **Inactive [iOS]**: The app is in transition; it is not receiving events but is still visible on the screen. This can occur during interruptions like a phone call, entering the multitasking view, or opening the Notification Center.

While React Native does not explicitly define a "terminated" state, it conceptually refers to apps that are neither actively running nor in the background. Since React Native does not provide a specific state for this scenario, it should be considered part of the "background" state management.

[React Native Documentation](https://reactnative.dev/docs/appstate).

## 2. Various States to Consider for WalkWays

Although React Native automatically handles state management and saves data when the user does not completely exit or terminate the app, it is important to consider the following states and significant data while developing my app:

1. **Active**: 
   - **Why Consider It**: Users are engaging with the app.
   - **What Must Happen**: The app should perform UI updates, handle user interactions, and fetch data in response to input.

2. **Background**:
   - **Why Consider It**: Users may switch to other apps, so the app needs to manage ongoing tasks like location tracking, timers, and step counting.
   - **What Must Happen**: The app should continue necessary background tasks and update data accordingly. Location services should remain active if the user is walking, and timers and step counting should continue or update when the user returns to the app.

3. **Inactive**:
   - **Why Consider It**: This state occurs during interruptions, such as incoming calls.
   - **What Must Happen**: The app should preserve the UI state, allowing users to resume their previous activities seamlessly. For example, if a user is writing a review or giving feedback, they should be able to complete their input after a phone call or switching applications.

---
\
_**Terminated**:_
   - **Why Consider It**: The app can be completely closed by the user or the operating system.
   - **What Must Happen**: The app should ensure any unsaved data is appropriately handled. Upon reopening, it may need to load the last known state or any ongoing data. It should not include information like the last interacted screen, as this does not hold significant value. This scenario should be managed within the context of the **background** state, as there is no separate state for "terminated" in React Native.
