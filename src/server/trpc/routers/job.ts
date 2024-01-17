import { procedure, router } from "@/server/trpc"
import { z } from "zod"
import { Job } from "@/lib/types"
import { search as indeedSearch } from "./helper/indeed"
import { search as linkedInSearch } from "./helper/linkedIn"

export const jobRouter = router({
  search: procedure
    .input(
      z.object({
        what: z.string(),
        where: z.string(),
      })
    )
    .query(async ({ input }): Promise<Job[]> => {
      // const [indeedJobs, linkedInJobs] = await Promise.all([
      //   indeedSearch(input.what, input.where),
      //   linkedInSearch(input.what, input.where),
      // ])

      const results = await Promise.allSettled([
        indeedSearch(input.what, input.where),
        linkedInSearch(input.what, input.where),
      ])

      const indeedJobs = results[0].status === "fulfilled" ? results[0].value : []
      const linkedInJobs = results[1].status === "fulfilled" ? results[1].value : []

      return [...indeedJobs, ...linkedInJobs]
    }),
})
