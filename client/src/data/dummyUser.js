export const CURRENT_USER = {
  id: 'usr-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@taskflow.dev',
  role: 'Frontend Lead & Admin',
  initials: 'AM',
  avatarColor: '#4f46e5',
  bio: 'Building intuitive digital experiences and robust frontend architectures.',
  location: 'San Francisco, CA',
  department: 'Product Engineering'
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Task Review Requested',
    message: 'Sarah Chen marked "Set up global search and filter pipeline" as ready for review.',
    time: '15 mins ago',
    unread: true,
    type: 'review'
  },
  {
    id: 'notif-2',
    title: 'Upcoming Due Date',
    message: '"Design high-fidelity dashboard wireframes" is due in 5 days.',
    time: '2 hours ago',
    unread: true,
    type: 'deadline'
  },
  {
    id: 'notif-3',
    title: 'Task Completed',
    message: 'Task "Create reusable Modal and Confirmation dialogs" was completed.',
    time: 'Yesterday',
    unread: false,
    type: 'success'
  }
];
