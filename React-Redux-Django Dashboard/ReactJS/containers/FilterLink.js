/**
 * Created by kgb on 9/14/17.
 */
import React from 'react'
import { Link } from 'react-router'

const FilterLink = ({ filter, children }) => (
  <Link
    to={filter === 'SHOW_ALL' ? '/' : filter}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </Link>
)

export default FilterLink