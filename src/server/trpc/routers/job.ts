import { procedure, router } from "@/server/trpc"

import { Job, SearchFormSchema } from "@/lib/types"
import { search as indeedSearch } from "./helper/indeed"
import { search as linkedInSearch } from "./helper/linkedIn"

export const jobRouter = router({
  search: procedure.input(SearchFormSchema).mutation(async ({ input }): Promise<Job[]> => {
    const [indeedJobs, linkedInJobs] = await Promise.all([
      indeedSearch(input),
      linkedInSearch(input),
    ])

    return [...indeedJobs, ...linkedInJobs]
  }),
})
