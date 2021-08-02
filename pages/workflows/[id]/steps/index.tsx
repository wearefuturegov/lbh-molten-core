import ResidentWidget from "../../../../components/ResidentWidget"
import TaskList from "../../../../components/TaskList"
import Layout from "../../../../components/_Layout"
import { getWorkflowServerSide } from "../../../../lib/serverSideProps"
import { WorkflowWithCreator } from "../../../../types"

const TaskListPage = (workflow: WorkflowWithCreator): React.ReactElement => {
  const title =
    workflow.type === "Full"
      ? "Assessment and support plan"
      : "Initial screening assessment"

  return (
    <Layout
      title={title}
      breadcrumbs={[
        { href: "/", text: "Dashboard" },
        { href: `/workflows/${workflow.id}`, text: "Workflow" },
        { current: true, text: "Task list" },
      ]}
    >
      <div className="govuk-grid-row govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="lbh-heading-h3">Submission incomplete</h2>
          <p>
            You&apos;ve completed {Object.keys(workflow.answers) || "0"} of X
            steps.
          </p>
          <TaskList workflow={workflow} />
        </div>
        <div className="govuk-grid-column-one-third">
          <ResidentWidget socialCareId={workflow.socialCareId} />
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = getWorkflowServerSide

export default TaskListPage
