// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
      phone: '',
      setup: true
    },
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442b',
      name: 'User2',
      email: 'user2@nextmail.com',
      password: '123456',
      phone: '',
      setup: true
    },
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442d',
      name: 'User3',
      email: 'user3@nextmail.com',
      password: '123456',
      phone: '',
      setup: false
    },
  ];
  
const selected_strategies = [
    {
      id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
      user_id: users[0].id,
      strategies: ['chunking', 'small_rewards', 'task_switching'],
      date_selected: '2024-10-01',
    },
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      user_id: users[1].id,
      strategies: ['pomodoro', 'check_list', 'work_partners'],
      date_selected: '2024-10-01',
    }
  ];
  
const assigned_strategies = [
    {
      user_id: users[0].id,
      strategy: selected_strategies[0].strategies[2],
      date: '2024-10-01',
    },
    {
      user_id: users[0].id,
      strategy: selected_strategies[0].strategies[1],
      date: '2024-10-02',
    },
    {
      user_id: users[1].id,
      strategy: selected_strategies[1].strategies[0],
      date: '2024-10-01',
    },
    {
      user_id: users[1].id,
      strategy: selected_strategies[1].strategies[2],
      date: '2024-10-02',
    },
    {
      user_id: users[1].id,
      strategy: selected_strategies[1].strategies[0],
      date: '2024-10-03',
    },
    {
      user_id: users[1].id,
      strategy: selected_strategies[1].strategies[1],
      date: '2024-10-04',
    },
  ];
  
export { users, selected_strategies, assigned_strategies };