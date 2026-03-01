import React from 'react';
import styles from './Table.module.scss';

interface BaseProps {
  className?: string;
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, BaseProps {}
export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement>, BaseProps {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement>, BaseProps {}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement>, BaseProps {}
export interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement>, BaseProps {}
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement>, BaseProps {}

const TableHead = ({ className = '', ...restProps }: TableHeadProps): React.ReactElement => {
  return <thead className={`${styles.tableHead} ${className}`.trim()} {...restProps} />;
};

const TableBody = ({ className = '', ...restProps }: TableBodyProps): React.ReactElement => {
  return <tbody className={`${styles.tableBody} ${className}`.trim()} {...restProps} />;
};

const TableRow = ({ className = '', ...restProps }: TableRowProps): React.ReactElement => {
  return <tr className={`${styles.tableRow} ${className}`.trim()} {...restProps} />;
};

const TableHeadCell = ({ className = '', ...restProps }: TableHeadCellProps): React.ReactElement => {
  return <th className={`${styles.tableHeadCell} ${className}`.trim()} {...restProps} />;
};

const TableCell = ({ className = '', ...restProps }: TableCellProps): React.ReactElement => {
  return <td className={`${styles.tableCell} ${className}`.trim()} {...restProps} />;
};

interface TableComponent extends React.FC<TableProps> {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  HeadCell: typeof TableHeadCell;
  Cell: typeof TableCell;
}

const TableBase = ({ className = '', ...restProps }: TableProps): React.ReactElement => {
  return <table className={`${styles.table} ${className}`.trim()} {...restProps} />;
};

const Table = Object.assign(TableBase, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
}) as TableComponent;

export default Table;
