"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Icons } from "./icons"

import { trpc } from "@/utils/trpc"
import { Job, SearchQuery, SearchFormSchema } from "@/lib/types"

type Props = {
  setJobs: (jobs: Job[]) => void
}

export default function SearchForm({ setJobs }: Props) {
  const { mutate: searchMutation, isLoading } = trpc.job.search.useMutation({
    onSuccess: (data) => {
      setJobs(data ?? [])
    },
  })

  const form = useForm<SearchQuery>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      // what: "java developer",
      // where: "london",
    },
  })

  function onSubmit(values: SearchQuery) {
    console.log(values)
    searchMutation(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex  space-x-2">
        <FormField
          control={form.control}
          name="what"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input id="input-what" placeholder="job title, keywords ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="where"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input id="input-where" placeholder="city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contract">contract</SelectItem>
                  <SelectItem value="permanent">permanent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postedBy"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="type of company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employer">employer</SelectItem>
                  <SelectItem value="agency">agency</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postedAt"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="date posted" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">last 24 hours</SelectItem>
                  <SelectItem value="3">last 3 days</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="icon" disabled={isLoading}>
          {isLoading ? <Icons.loader className="animate-spin" /> : <Icons.search />}
        </Button>
      </form>
    </Form>
  )
}
