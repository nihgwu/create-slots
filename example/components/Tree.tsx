import { createHost, createSlot, getSlots } from 'create-slots/list'

type Node = string | Node[]

export const Item = createSlot<React.FC<{ value: Node }>>()

export const Menu = (props: { children: React.ReactNode }) => {
  return createHost(props.children, (slots) => {
    const items = getSlots(slots, Item)
    const value = items.map((item) => item.props.value)

    return <Item value={value} />
  })
}

export const Tree = (props: { children: React.ReactNode }) => {
  return createHost(props.children, (slots) => {
    const items = getSlots(slots, Item)
    const value = items.map((item) => item.props.value)

    return <pre>{JSON.stringify(value, undefined, 2)}</pre>
  })
}

Tree.Menu = Menu
Tree.Item = Item
