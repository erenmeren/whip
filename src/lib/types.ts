import * as z from "zod"

export type Job = {
  site: string
  url: string
  title: string
  companyName: string
  companyUrl: string
  location: string
  salary: string
  jobType: string
  postedAt: string
  status: string
}

export const SearchFormSchema = z.object({
  what: z
    .string({
      required_error: "What is required",
    })
    .min(2, {
      message: "What must be at least 2 characters.",
    }),
  where: z
    .string({
      required_error: "Where is required",
    })
    .min(2, {
      message: "Where must be at least 2 characters.",
    }),
  jobType: z.enum(["contract", "permanent"]).optional(),
  postedBy: z.enum(["agency", "employer"]).optional(),
  postedAt: z.enum(["1", "3", "7", "14"]).optional(),
})

export type SearchQuery = z.infer<typeof SearchFormSchema>
