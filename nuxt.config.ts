export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss'
    ],
    build: {
        transpile: ['@supabase/supabase-js']
    },
    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
        }
    },
    css: ['~/assets/tailwind.css']
})
