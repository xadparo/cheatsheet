import React, { ReactNode, useState, createContext, useContext } from 'react'

type useVisibleProps = {
	defaultVisible?: boolean
	defaultExist?: boolean
	defaultOpacity?: number

	defaultNegativeAction?: 'close' | 'destroy' | 'transparent' | (() => void)
	positiveCallback?: Function
	negativeCallback?: Function
}
const defaultVisible = false
const defaultExist = false
const defaultOpacity = 0

export const useVisible = (props: useVisibleProps) => {
	const {
		defaultNegativeAction = 'close',
		positiveCallback,
		negativeCallback,
	} = props

	const [visible, setVisible] = useState(props.defaultVisible ?? defaultVisible)
	const [exist, setExist] = useState(props.defaultExist ?? defaultExist)
	const [opacity, setOpacity] = useState(props.defaultOpacity ?? defaultOpacity)

	const open = () => {
		setOpacity(1)
		setVisible(true)
		setExist(true)
		positiveCallback?.()
	}
	const close = () => {
		setVisible(false)
		negativeCallback?.()
	}
	const destroy = () => {
		setExist(false)
		negativeCallback?.()
	}
	const transparent = () => {
		setOpacity(0)
		negativeCallback?.()
	}
	const negativeActionMap = { close, destroy, transparent }
	const negativeAction = typeof defaultNegativeAction === 'function' ? defaultNegativeAction : negativeActionMap[defaultNegativeAction]
	const toggle = () => {
		if(visible && exist && opacity) {
			negativeAction()
		} else {
			open()
		}
	}

	return {
		visible,
		opacity,
		exist,
		open,
		close,
		destroy,
		transparent,
		negativeAction,
		toggle,
	}
}
export type Visible = ReturnType<typeof useVisible>
export const visibleContext = createContext<Visible | null>(null)

export const VisibleArea = (props: {
	visible?: Visible,
	children: ReactNode,
	className?: string
}) => {
	const { children, className } = props
	const { visible, opacity, exist } = props.visible ?? useContext(visibleContext) ?? {}

	return exist && <>
		<div
			className={`${visible? 'visible': 'hidden'} ${className || ''}`}
			style={{ opacity }}
		>
			{children}
		</div>
	</> || null
}
