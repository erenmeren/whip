import puppeteer, { ElementHandle } from "puppeteer"
import { Job, SearchQuery } from "@/lib/types"
import { TRPCError } from "@trpc/server"

const BASE_URL = "https://www.cwjobs.co.uk"

export async function search(query: SearchQuery): Promise<Job[]> {
  const result: Job[] = []
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  let searchUrl = `${BASE_URL}/jobs${buildQuery(query)}`

  console.log(searchUrl)

  try {
    console.log("(((object)))")
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 10000 })

    const jobCardAttributes = await page.$$('[data-genesis-element="CARD"]')

    for (const jobCardDiv of jobCardAttributes) {
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
  const jobType = ""

  const [jobTitleA, companyUrlA, companyNameImg, locationSpan, salarySpan, postedAtTime] =
    await Promise.all([
      jobCardDiv.$('[data-at="job-item-title"]'),
      jobCardDiv.$('[data-genesis-element="COMPANY_LOGO_LINK"]'),
      jobCardDiv.$('[data-genesis-element="COMPANY_LOGO_IMAGE"]'),
      jobCardDiv.$('[data-at="job-item-location"]'),
      jobCardDiv.$('[data-at="job-item-salary-info"]'),
      jobCardDiv.$('[data-at="job-item-timeago"]'),
    ])

  const companyUrl = await companyUrlA?.evaluate((element) => element?.getAttribute("href"))
  const companyName = await companyNameImg?.evaluate((element) => element?.getAttribute("alt"))
  const jobTitle = await jobTitleA?.evaluate((element) => element?.textContent?.trim())
  const jobUrl = await jobTitleA?.evaluate((element) => element?.getAttribute("href"))
  const location = await locationSpan?.evaluate((element) => element?.textContent?.trim())
  const salary = await salarySpan?.evaluate((element) => element?.textContent?.trim())
  const postedAt = await postedAtTime?.evaluate((element) => element?.textContent?.trim())

  return {
    site: "cw jobs",
    companyName: companyName ?? "",
    companyUrl: BASE_URL + companyUrl,
    location: location ?? "",
    url: BASE_URL + (jobUrl ?? ""),
    title: jobTitle ?? "",
    salary: salary ?? "",
    jobType,
    postedAt: postedAt ?? "",
    status: "",
  }
}

function buildQuery(query: SearchQuery): string {
  const encodedWhat = encodeURIComponent(query.what) // keyword
  const encodedWhere = encodeURIComponent(query.where) // location

  let searchQuery = `/${encodedWhat}/in-${encodedWhere}`

  // jop type
  // if (query.jobType) {
  //   let encodedJobType = ""

  //   if (query.jobType === "permanent") {
  //     encodedJobType = encodeURIComponent("0kf:jt(permanent);")
  //   } else if (query.jobType === "contract") {
  //     encodedJobType = encodeURIComponent("0kf:jt(contract);")
  //   }

  //   searchQuery += `&sc=${encodedJobType}`
  // }

  // posted by
  // if (query.postedBy) {
  //   let encodedPostedBy = ""

  //   if (query.postedBy === "agency") {
  //     encodedPostedBy = "1"
  //   } else if (query.postedBy === "employer") {
  //     encodedPostedBy = "2"
  //   }

  //   searchQuery += `&companytypes=${encodedPostedBy}`
  // }

  // // posted at
  // if (query.postedAt) {
  //   searchQuery += `&postedWithin=${query.postedAt}`
  // }

  return searchQuery
}
