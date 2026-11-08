import { ref, onMounted, computed } from 'vue'

const theme = ref('dark')

export function useTheme() {
    const isDark = computed(() => theme.value === 'dark')

    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        applyTheme()
        if (!process.server) {
            localStorage.setItem('admin-theme', theme.value)
        }
    }

    const applyTheme = () => {
        if (process.server) return
        const html = document.documentElement
        if (theme.value === 'dark') {
            html.classList.add('dark')
            html.classList.remove('light')
        } else {
            html.classList.add('light')
            html.classList.remove('dark')
        }
    }

    onMounted(() => {
        // Only run once if possible, but harmless to run multiple times
        const savedTheme = localStorage.getItem('admin-theme')
        if (savedTheme) {
            theme.value = savedTheme
        }
        applyTheme()
    })

    return {
        theme,
        isDark,
        toggleTheme
    }
}
