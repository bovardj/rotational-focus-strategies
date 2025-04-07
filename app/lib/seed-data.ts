// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
      phone: ''
    },
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442b',
      name: 'User2',
      email: 'user2@nextmail.com',
      password: '123456',
      phone: ''
    },
  ];
  
const strategies = [
    {
      id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
      user_id: users[0].id,
      strategies: ['chunking', 'small_rewards', 'task_switching'],
    },
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      user_id: users[1].id,
      strategies: ['pomodoro', 'check_list', 'partner'],
    }
  ];
  
  export { users, strategies };
  