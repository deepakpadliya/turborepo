import React from 'react'
import './Anchor.scss'
export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode
}

const Anchor = ({children, ...rest}: AnchorProps) => {
  return (
    <a className='anchor' {...rest}>{children}</a>
  )
}
export default Anchor;
