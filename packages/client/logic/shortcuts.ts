import { Fn, not, and } from '@vueuse/core'
import { watch } from 'vue'
import { fullscreen, magicKeys, shortcutsEnabled, isInputing, toggleOverview, showGotoDialog, showOverview, isOnFocus } from '../state'
import { toggleDark } from './dark'
import { next, nextSlide, prev, prevSlide } from './nav'

const _shortcut = and(not(isInputing), not(isOnFocus), shortcutsEnabled)

export function shortcut(key: string, fn: Fn, autoRepeat = false) {
  const source = and(magicKeys[key], _shortcut)
  let count = 0
  let timer: any
  const trigger = () => {
    clearTimeout(timer)
    if (!source.value) {
      count = 0
      return
    }
    if (autoRepeat) {
      timer = setTimeout(trigger, Math.max(1000 - count * 250, 150))
      count++
    }
    fn()
  }

  return watch(source, trigger, { flush: 'sync' })
}

export function registerShotcuts() {
  // global shortcuts
  shortcut('space', next, true)
  shortcut('right', next, true)
  shortcut('left', prev, true)
  shortcut('up', () => prevSlide(false), true)
  shortcut('down', nextSlide, true)
  shortcut('shift_left', () => prevSlide(false), true)
  shortcut('shift_right', nextSlide, true)
  shortcut('d', toggleDark)
  shortcut('f', () => fullscreen.toggle())
  shortcut('o', toggleOverview)
  shortcut('escape', () => showOverview.value = false)
  shortcut('g', () => showGotoDialog.value = !showGotoDialog.value)
}
