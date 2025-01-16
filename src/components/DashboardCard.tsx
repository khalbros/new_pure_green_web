import {Card, CardBody, CardHeader} from "@material-tailwind/react"
import {color} from "@material-tailwind/react/types/components/alert"
import {ReactNode} from "react"

interface CardProps {
  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode
  color?: color
}

function DashboardCard({header, body, color}: CardProps) {
  return (
    <Card className="mt-8">
      <CardHeader color={color} className="relative p-1 md:p-2">
        {header}
      </CardHeader>
      <CardBody className="py-2">{body}</CardBody>
    </Card>
  )
}

export default DashboardCard
