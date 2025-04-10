import Link from 'next/link';

export default function StrategyDescriptions({ strategy }: { strategy: string }) {
  return (
    <div className='flex flex-col xl:flex-row gap-4'>
      <div className='xl:w-2/3 2xl:w-1/2'>
        <StrategyDetails strategy={strategy} />
      </div>
    </div>
  )
}

// export default 
function StrategyDetails({ strategy }: { strategy: string }) {
  if (strategy === "bg_sound") return (
    <div>
      <p className="text-md">
        Work with sounds in the background. This should strike a balance that may help you to focus
        on your work while not being too distracting. Some suggestions (some with external links) are:
      </p>
      <ul className="list-disc pl-4 mt-2 ml-4">
        <li>Ambient sounds</li>
        <li>
          <Link
          className='text-blue-600 hover:text-blue-800'
          href={"https://www.youtube.com/watch?v=dv2XyqC-EQ4&t=40s"}>
            White noise
            </Link>
          </li>
        <li>
          <Link
          className='text-blue-600 hover:text-blue-800'
          href={"https://www.youtube.com/watch?v=P48QELwruQs"}>
            Brown noise
          </Link>
          </li>
        <li>
          <Link
          className='text-blue-600 hover:text-blue-800'
          href={"https://www.youtube.com/watch?v=ipf7ifVSeDU"}>
            Nature sounds
          </Link>
        </li>
        <li>Instrumental music</li>
        <li>
          <Link
          className='text-blue-600 hover:text-blue-800'
          href={"https://www.youtube.com/watch?v=jfKfPfyJRdk"}>
            Lo-fi beats
          </Link>
        </li>
        <li>Classical music</li>
      </ul>
      <p className="text-md mt-4">
        You can also try to find a playlist that is specifically designed for studying or working.
        These playlists often have a mix of different types of music and sounds that can help you
        to focus.
      </p>
      <p className="text-md mt-4">
        Some people even find that having a TV show on in the background can help them focus. If you
        are one of those people, try to find a show that you have already seen so that it does not
        distract you too much. You can also try to find a show that is not too engaging, so that you
        can still focus on your work.
      </p>
    </div>
  )

  if (strategy === "check_list") return (
    <div>
      <p className="text-md">
        A checklist is a great way to keep track of your progress and make sure that you are
        completing all of the tasks that you need to do. You can use a physical checklist or a
        digital one, depending on your preference. Some people find that having a physical checklist
        helps them to stay focused, while others prefer to use a digital one because it is more
        convenient.
      </p>
      <p className="text-md mt-4">
        You can create a checklist for each task that you need to complete, or you can create a
        master checklist that includes all of the tasks that you need to do. If you are using a
        digital checklist, you can also set reminders for each task so that you do not forget to do
        them.
      </p>
    </div>
  )

  if (strategy === "chunking") return (
    <div>
      <p className="text-md">
        Chunking is a technique that involves breaking down large tasks into smaller, more manageable
        ones. This can help you to stay focused and avoid feeling overwhelmed by the overall task.
      </p>
      <p className="text-md mt-4">
        You can use chunking to break down any task, whether it is a large project or a small one.
        For example, if you are working on a large project, you can break it down into smaller
        chunks, such as research, writing, and editing. This will help you to stay focused and make
        progress on the project without feeling overwhelmed.
      </p>
      <p className="text-md mt-4">
        You can also use chunking to break down smaller tasks into even smaller ones. For example, if
        you are writing a paper, you can break it down into smaller tasks, such as writing the
        introduction, writing different parts of the body, and writing the conclusion. This will help
        you to stay focused and make progress on the paper without feeling overwhelmed.
      </p>
    </div>
  )

  // Not currently in use
  if (strategy === "daily_planner") return (
    <div>
      <p className="text-md">
        A daily planner is a great way to keep track of your tasks and make sure that you are
        completing everything that you need to do. You can use a physical planner or a digital one,
        depending on your preference. Some people find that having a physical planner helps them to
        stay focused, while others prefer to use a digital one because it is more convenient.
      </p>
      <p className="text-md mt-4">
        You can create a daily planner for each day of the week, or you can create a master planner
        that includes all of the tasks that you need to do for the week. If you are using a digital
        planner, you can also set reminders for each task so that you do not forget to do them.
      </p>
    </div>
  )

  if (strategy === "environmental_shift") return (
    <div>
      <p className="text-md">
        An environmental shift is a technique that involves changing your environment to help you
        focus. This can be as simple as moving to a different room or changing the lighting in your
        workspace. You can also try to find a quiet place to work, such as a library or a coffee
        shop.
      </p>
      <p className="text-md mt-4">
        You can also try to find a place that is free from distractions, such as your phone or
        television. This will help you to stay focused and avoid getting distracted by things that are
        going on around you.
      </p>
    </div>
  )

  if (strategy === "pomodoro") return (
    <div>
      <p className="text-md">
        The Pomodoro Technique is a time management method that involves working in short bursts of
        time, followed by short breaks. This can help you to stay focused and avoid feeling
        overwhelmed by the task at hand.
      </p>
      <p className="text-md mt-4">
        You can use a timer to set a specific amount of time for each work session, such as 25
        minutes, followed by a short break of 5 minutes. After four work sessions, you can take a
        longer break of 15-30 minutes.
      </p>
    </div>
  )

  if (strategy === "small_rewards") return (
    <div>
      <p className="text-md">
        Small rewards are a great way to motivate yourself to complete tasks. You can use small
        rewards to help you stay focused and avoid feeling overwhelmed by the task at hand.
        For example, if you are working on a large project, you can reward yourself with a
        small treat or a short break after completing each task.
      </p>
      <p className="text-md mt-4">
        You can also use small rewards to help you stay focused on smaller tasks. For example, if you
        are writing a paper, you can reward yourself with a small treat or a short break after
        completing each section of the paper.
      </p>
    </div>
  )

  if (strategy === "task_switching") return (
    <div>
      <p className="text-md">
        Task switching is a technique that involves switching between different tasks to help you
        stay focused. It can act as a kind of mental break from a task that you may be
        struggling with, helping you to avoid feeling overwhelmed while still making progress
        on things you need to do. 
      </p>
      <p className="text-md mt-4">
        For example, if you are working on a project and get stuck on one part, you can switch to 
        another part of the project or a different task entirely &#40;i.e. perhaps cleaning 
        dishes&#41;. This can help refresh your mind and provide new perspectives on
        a task you may have been struggling with.
      </p>
    </div>
  )

  if (strategy === "work_partners") return (
    <div>
      <p className="text-md">
        Work partners are a great way to stay focused and avoid feeling overwhelmed by a task. 
        This doesn&apos;t necessarily mean working with someone else, but rather working nearby to
        someone else who is also working on a task. Along with individuals, it can also be a group of
        people who are working independently on different tasks, but are in the same space.
      </p>
      {/* <p className="text-lg mt-4">
        You can also try to find a partner who is working on a similar task, so that you can help
        each other stay focused and make progress on your goals.
      </p> */}
    </div>
  )
}