import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEvn } from '@/helpers/getEnv'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 character long.'),
  slug: z.string().min(3, 'Slug must be at least 3 character long.'),
})

const AddCategory = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', slug: '' },
  })

  const categoryName = form.watch('name')

  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true })
      form.setValue('slug', slug)
    }
  }, [categoryName, form])

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/category/add`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include', // Add this if your backend expects cookies/auth
        body: JSON.stringify(values)
      })
      const data = await response.json()
      if (!response.ok) {
        // Show backend error message for easier debugging
        showToast('error', data.message || "Could not add category")
        return
      }
      form.reset()
      showToast('success', data.message || "Category added")
    } catch (error) {
      showToast('error', error.message || "Error submitting category")
    }
  }

  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Category slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory