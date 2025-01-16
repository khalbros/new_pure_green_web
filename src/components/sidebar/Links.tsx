import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react"
import {IRoute} from "../../routes"
import {TbChevronDown} from "react-icons/tb"
import {useNavigate} from "react-router-dom"

interface ILink {
  link: IRoute
  open?: string
  handleOpen: (name: string) => void
}

function Links({link, open, handleOpen}: ILink) {
  const navigate = useNavigate()

  function handleClick(link: IRoute) {
    handleOpen(link.name)
    navigate(link.path)
  }

  if (link.children) {
    return (
      <Accordion
        open={open === link.name}
        icon={
          <TbChevronDown
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === link.name ? "rotate-180" : ""
            }`}
          />
        }>
        <ListItem
          className="p-0 text-green-700 hover:bg-green-200 focus:bg-green-100 focus:text-green-900"
          selected={open === link.name}
          onClick={() => handleOpen(link.name)}>
          <AccordionHeader className="border-b-0 p-3 text-green-700 hover:bg-green-200 focus:bg-green-100 focus:text-green-900">
            <ListItemPrefix className="text-green-700 focus:text-green-900">
              {link?.icon}
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className="mr-auto font-normal capitalize text-green-700 focus:text-green-900">
              {link.name}
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="pl-14 md:pl-10">
            {link.children?.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => handleClick(item)}
                className="text-green-700 hover:bg-green-200 focus:bg-green-100 focus:text-green-900 capitalize">
                {item.name}
              </ListItem>
            ))}
          </List>
        </AccordionBody>
      </Accordion>
    )
  } else {
    return (
      <ListItem
        selected={open === link.name ? true : false}
        onClick={() => handleClick(link)}
        className="text-green-700 hover:bg-green-200 focus:bg-green-100 focus:text-green-900 capitalize">
        {link.icon ? (
          <ListItemPrefix className="text-green-700 focus:text-green-900">
            {link.icon}
          </ListItemPrefix>
        ) : null}
        {link.name}
      </ListItem>
    )
  }
}

export default Links
