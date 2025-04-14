export const strategyDictionary = [
  { name: "Background Sound", href: 'bg_sound' },
  { name: "Check List", href: 'check_list' },
  { name: "Chunking", href: 'chunking' },
  // { name: "Daily Planner", href: 'daily_planner' },
  { name: "Environmental Shift", href: 'environmental_shift' },
  { name: "Pomodoro Technique", href: 'pomodoro' },
  { name: "Small Rewards", href: 'small_rewards' },
  { name: "Task Switching", href: 'task_switching' },
  { name: "Work Partners", href: 'work_partners' },
];

// Date handling:
// Source: https://medium.com/@sungbinkim98/is-your-javascript-date-one-day-off-c56afb37e4bc
// const dateOnlyRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])))$/

// The regex isn't working, but that's fine because I always need to do the conversion
export function parseDateString(dateString: string) {
  // if (dateOnlyRegex.test(dateString)) {
    const utcDate = new Date(dateString)
    console.log('utcDate.getTimezoneOffset():', utcDate.getTimezoneOffset())
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
    return localDate  
  // }
  // return new Date(dateString)
}
