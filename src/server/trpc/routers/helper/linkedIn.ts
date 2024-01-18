import puppeteer, { ElementHandle } from "puppeteer"
import { Job, SearchQuery } from "@/lib/types"
import { TRPCError } from "@trpc/server"

const BASE_URL = "https://www.linkedin.com"

export async function search(query: SearchQuery): Promise<Job[]> {
  const result: Job[] = []
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  const encodedWhat = encodeURIComponent(query.what)
  const encodedWhere = encodeURIComponent(query.where)
  const searchUrl = `${BASE_URL}/jobs/search/?keywords=${encodedWhat}&location=${encodedWhere}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&position=1&pageNum=0jobs?q=${encodedWhat}&l=${encodedWhere}`

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 10000 })

    const jobCardDivs = await page.$$(".base-card")

    for (const jobCardDiv of jobCardDivs) {
      const jobData = await getJobData(jobCardDiv)
      if (jobData) {
        result.push(jobData)
      }
    }

    return result
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: errorMessage })
  } finally {
    await browser.close()
  }
}

async function getJobData(jobCardDiv: ElementHandle): Promise<Job | null> {
  const [
    jobTitleAElement,
    companyAElemnt,
    locationSpanElement,
    salarySpanElemnt,
    postedAtTimeElemnt,
    statusSpanElement,
  ] = await Promise.all([
    jobCardDiv.$(".base-card__full-link"),
    jobCardDiv.$(".base-search-card__subtitle"),
    jobCardDiv.$(".job-search-card__location"),
    jobCardDiv.$(".job-search-card__salary-info"),
    jobCardDiv.$(".job-search-card__listdate"),
    jobCardDiv.$(".job-search-card__benefits"),
  ])

  const jobTitle = await jobTitleAElement?.evaluate((element) => element?.textContent?.trim())
  const jobLink = await jobTitleAElement?.evaluate((element) => element?.getAttribute("href"))
  const compnayName = await companyAElemnt?.evaluate((element) => element?.textContent?.trim())
  const companyUrl = await companyAElemnt?.evaluate((element) => element?.getAttribute("href"))
  const location = await locationSpanElement?.evaluate((element) => element?.textContent?.trim())
  const salary = await salarySpanElemnt?.evaluate((element) => element?.textContent?.trim())
  const postedAt = await postedAtTimeElemnt?.evaluate((element) => element?.textContent?.trim())
  const status = await statusSpanElement?.evaluate((element) => element?.textContent?.trim())

  return {
    site: "LinkedIn",
    companyName: compnayName ?? "",
    companyUrl: companyUrl ?? "",
    location: location ?? "",
    url: jobLink ?? "",
    title: jobTitle ?? "",
    salary: salary ?? "",
    jobType: "",
    status: status ?? "",
    postedAt: postedAt ?? "",
  }
}
