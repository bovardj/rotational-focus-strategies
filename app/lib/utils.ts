export const strategyDictionary = [
  { name: "Background Sound", href: 'bg_sound' },
  { name: "Check List", href: 'check_list' },
  { name: "Chunking", href: 'chunking' },
  { name: "Environmental Shift", href: 'environmental_shift' },
  { name: "Pomodoro Technique", href: 'pomodoro' },
  { name: "Small Rewards", href: 'small_rewards' },
  { name: "Task Switching", href: 'task_switching' },
  { name: "Work Partners", href: 'work_partners' },
];

// Date handling:
// Source: https://medium.com/@sungbinkim98/is-your-javascript-date-one-day-off-c56afb37e4bc

// The regex isn't working, but that's fine because I always need to do the conversion
export function parseDateString(dateString: string) {
    const utcDate = new Date(dateString)
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
    return localDate
}
