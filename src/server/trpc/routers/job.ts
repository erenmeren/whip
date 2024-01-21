import { procedure, router } from "@/server/trpc"

import { Job, SearchFormSchema } from "@/lib/types"
import { search as indeedSearch } from "./helper/indeed"
import { search as linkedInSearch } from "./helper/linkedIn"
import { search as cwJobsSearch } from "./helper/cwJobs"

export const jobRouter = router({
  search: procedure.input(SearchFormSchema).mutation(async ({ input }): Promise<Job[]> => {
    // const [indeedJobs, linkedInJobs, cwJobs] = await Promise.all([
    //   indeedSearch(input),
    //   linkedInSearch(input),
    //   cwJobsSearch(input),
    // ])
    // return [...indeedJobs, ...linkedInJobs, ...cwJobs]
    const [cwJobs] = await Promise.all([cwJobsSearch(input)])

    return cwJobs
  }),
})
