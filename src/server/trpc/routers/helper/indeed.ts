import puppeteer, { ElementHandle } from "puppeteer"
import { Job } from "@/lib/types"
import { TRPCError } from "@trpc/server"

const BASE_URL = "https://uk.indeed.com"

export async function search(what: string, where: string): Promise<Job[]> {
  const result: Job[] = []
  const browser = await puppeteer.launch({ headless: false })

  const page = await browser.newPage()

  const encodedWhat = encodeURIComponent(what)
  const encodedWhere = encodeURIComponent(where)
  const searchUrl = `${BASE_URL}/jobs?q=${encodedWhat}&l=${encodedWhere}`

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 10000 })

    const jobCardDivs = await page.$$(".job_seen_beacon")

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
  const [jobTitleA, salaryDiv, companyNameDiv, locationDiv, jobTypesDiv] = await Promise.all([
    jobCardDiv.$(".jcs-JobTitle"),
    jobCardDiv.$(".salary-snippet-container"),
    jobCardDiv.$('[data-testid="company-name"]'),
    jobCardDiv.$('[data-testid="text-location"]'),
    jobCardDiv.$$('[data-testid="attribute_snippet_testid"]'),
  ])

  const jobTitle = await jobTitleA?.evaluate((element) => element?.textContent)
  const jobUrl = await jobTitleA?.evaluate((element) => element?.getAttribute("href"))
  const salary = await salaryDiv?.evaluate((element) => element?.textContent?.trim())
  const companyName = await companyNameDiv?.evaluate((element) => element?.textContent?.trim())
  const location = await locationDiv?.evaluate((element) => element?.textContent?.trim())
  const jobType = (
    await Promise.all(
      jobTypesDiv.slice(1).map((el) => el.evaluate((node) => node.textContent?.trim()))
    )
  )
    .filter(Boolean)
    .join(", ")

  return {
    site: "Indeed",
    companyName: companyName ?? "",
    companyUrl: "#",
    location: location ?? "",
    url: BASE_URL + (jobUrl ?? ""),
    title: jobTitle ?? "",
    salary: salary ?? "",
    jobType,
    postedAt: "",
    status: "",
  }
}
