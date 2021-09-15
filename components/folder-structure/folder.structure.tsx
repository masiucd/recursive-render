import Button from "@components/elements/button"
import File from "@components/icons/file"
import FolderClosed from "@components/icons/folder.closed"
import FolderOpen from "@components/icons/folder.open"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import useToggle from "@hooks/toggle"
import {colorsMain, elevations} from "@styles/styles"
import {FC, Fragment} from "react"

import data from "../../data/folder-data.json"

interface Item {
  id: number
  parentId: number | null
  text: string
}
interface Node extends Item {
  hasChildren: boolean
  children: Item[]
}
const formatData = (data: Array<Item>) => {
  return data.map((item: Item) => ({
    ...item,
    hasChildren: data.filter((node) => node.parentId === item.id).length > 0,
    children: data.filter((node) => node.parentId === item.id),
  }))
}

const Wrapper = styled.div`
  border: 1px solid #000;
  max-width: 50rem;
  margin: 1rem auto;
  min-height: 50vh;
`

const FolderStructure = () => {
  return (
    <Wrapper>
      {/* TODO: Make a filter component here */}
      <Tree treeData={formatData(data)} />
    </Wrapper>
  )
}

const renderIcon = (on: boolean, hasChildren: boolean) => {
  switch (true) {
    case hasChildren && on:
      return <FolderOpen />
    case hasChildren && !on:
      return <FolderClosed />
    default:
      return <File />
  }
}

const RowStyles = styled.div`
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 3rem;
`
interface RowProps {
  level: number
  node: Node
}
const Row: FC<RowProps> = ({level, node, children}) => {
  const [on, toggleOn] = useToggle()
  return (
    <Fragment>
      <RowStyles
        css={css`
          margin-left: ${level * 3}rem;
        `}
      >
        <Button
          onClick={() => toggleOn()}
          styles={css`
            display: flex;
            align-items: center;
            border: 1px solid
              ${on ? `${colorsMain.primary}` : `${colorsMain.highlight}`};
            box-shadow: ${on ? `${elevations.xl}` : `${elevations.sm}`};

            align-items: center;
            padding: 0.2rem 0.5rem;
          `}
        >
          <p
            css={css`
              text-transform: uppercase;
              font-size: 0.7rem;
              margin-right: 0.3rem;
            `}
          >
            {node.text}
          </p>{" "}
          {renderIcon(on, node.hasChildren)}
        </Button>
      </RowStyles>
      {on && children}
    </Fragment>
  )
}

interface TreeProps {
  treeData: Array<Node>
  parentId?: number | null
  level?: number
}

const Tree: FC<TreeProps> = ({
  treeData,
  parentId = null,
  level = 0,
}): JSX.Element[] | any => {
  const nodes = treeData.filter((node) => node.parentId === parentId)
  return nodes.map((node) => (
    <Row key={node.id} node={node} level={level}>
      <Tree treeData={treeData} parentId={node.id} level={level + 1} />
    </Row>
  ))
}

export default FolderStructure
