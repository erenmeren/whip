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
