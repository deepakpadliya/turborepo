import React from 'react'
import './Anchor.scss'
export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode
}

const Anchor = (props:AnchorProps) => {
  return (
    <a className='anchor' {...props}>{props.children}</a>
  )
}

export default Anchor