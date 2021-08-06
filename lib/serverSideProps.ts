import { GetServerSideProps } from "next"
import prisma from "./prisma"
import { getResidentById } from "./residents"

export const getResidentServerSide: GetServerSideProps = async ({ query }) => {
  const { social_care_id } = query

  const resident = await getResidentById(social_care_id as string)

  // redirect if resident doesn't exist
  if (!resident)
    return {
      props: {},
      redirect: {
        destination: "/404",
      },
    }

  return {
    props: {
      ...resident,
    },
  }
}

export const getWorkflowsServerSide: GetServerSideProps = async () => {
  const workflows = await prisma.workflow.findMany({
    where: {
      discardedAt: null,
    },
    include: {
      creator: true,
      assignee: true,
    },
    orderBy: {
      heldAt: "desc",
    },
  })

  return {
    props: {
      workflows: JSON.parse(JSON.stringify(workflows)),
    },
  }
}

export const getWorkflowServerSide: GetServerSideProps = async ({ query }) => {
  const { id } = query

  const workflow = await prisma.workflow.findUnique({
    where: { id: id as string },
    include: {
      creator: true,
      assignee: true,
    },
  })

  // redirect if resident doesn't exist
  if (!workflow)
    return {
      props: {},
      redirect: {
        destination: "/404",
      },
    }

  return {
    props: {
      ...JSON.parse(JSON.stringify(workflow)),
    },
  }
}

export const getWorkflowWithRevisionsServerSide: GetServerSideProps = async ({
  params,
}) => {
  const { id } = params

  const workflow = await prisma.workflow.findUnique({
    where: { id: id as string },
    include: {
      creator: true,
      assignee: true,
      updater: true,
      revisions: {
        include: {
          actor: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  // redirect if resident doesn't exist
  if (!workflow)
    return {
      props: {},
      redirect: {
        destination: "/404",
      },
    }

  return {
    props: {
      ...JSON.parse(JSON.stringify(workflow)),
    },
  }
}
