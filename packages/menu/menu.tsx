import {
  reactive,
  createComponent,
  provide,
  onMounted,
  watch,
  h,
  nextTick,
  computed
} from 'vue3'
import { findComponentsDownward } from '../utils/util'
import useEvents from '../utils/useEvents'

// import { MenuProps, MenuEvent } from './type'

export const menuProps = {
  mode: { type: String, default: 'inline' },
  theme: { type: String, default: 'light' },
  activeName: [String, Number],
  inlineCollapsed: { type: Boolean, default: false },
  width: { type: String, default: '240px' },
  router: { type: Boolean, default: false },
  openNames: Array
}

const Menu = createComponent({
  name: 'Menu',
  props: menuProps,
  setup(props, { slots, emit }) {
    const state = reactive({
      currentActiveName: props.activeName,
      openedNames: props.openNames!
    })
    const { $on, $broadcast, vm } = useEvents()

    provide('menu', {
      setActiveName
    })

    function setActiveName(name: string) {
      state.currentActiveName = name
      emit('select', name)
    }

    onMounted(() => {
      updateOpened()
      nextTick(() => updateActiveName())
    })

    watch(() => props.openNames, val => (state.openedNames = val!))
    watch(() => props.activeName, val => (state.currentActiveName = val))
    watch(() => state.currentActiveName, () => updateActiveName())

    function updateActiveName() {
      if (state.currentActiveName === undefined) {
        state.currentActiveName = -1
      }
      $broadcast('SubMenu', 'updateActiveName', false)
      $broadcast('MenuItem', 'updateActiveName', state.currentActiveName)
    }

    function updateOpened() {
      const items = findComponentsDownward(vm, 'SubMenu')
      if (items.length) {
        items.forEach((item: any) => {
          item.opened = (state.openedNames as string[]).indexOf(item.name) > -1
        })
      }
    }

    const attrs = computed(() => {
      const style: any = {}
      const { theme, mode, width } = props
      const klass = ['at-menu', `at-menu--${theme}`, `at-menu--${mode}`]
      mode === 'inline' || (mode === 'vertical' && (style.width = width))
      return {
        class: klass,
        style
      }
    })
    return () => h('ul', attrs.value, slots.default && slots.default())
  }
})

export default Menu