import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuratie ontbreekt in runtimeConfig')
    return {
      provide: {
        supabase: null
      }
    }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  return {
    provide: {
      supabase
    }
  }
})