import {useEffect, useMemo, useState} from "react"

function usePagination<T>(data?: T[]) {
  const [itemsPerPage, setItemsPerPage] = useState<number>(100)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pages, setPages] = useState<number[]>()

  const indexOfFirstItem = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  )
  const indexOfLastItem = useMemo(
    () => itemsPerPage * currentPage,
    [itemsPerPage, currentPage]
  )

  const currentItems = useMemo(
    () => data?.slice(indexOfFirstItem, indexOfLastItem),
    [data, indexOfFirstItem, indexOfLastItem]
  )

  const changePage = (page: number): void => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const nextPage = (): void => {
    if (currentPage !== pages?.length) {
      setCurrentPage(currentPage + 1)
    }
  }
  const prevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  useEffect(() => {
    if (data) {
      const page = []
      for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
        page.push(i)
      }
      setPages(page)
    }
  }, [data])

  return {
    pages,
    currentPage,
    currentItems,
    nextPage,
    prevPage,
    changePage,
    setItemsPerPage,
  }
}

export default usePagination
