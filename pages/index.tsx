import Layout from "../components/_Layout"
import WorkflowList from "../components/WorkflowList"
import { Resident, Status, WorkflowWithExtras } from "../types"
import { getWorkflows } from "../lib/serverQueries"
import { GetServerSideProps } from "next"
import { getResidentById } from "../lib/residents"
import { prettyResidentName } from "../lib/formatters"
import SearchBox from "../components/SearchBox"
import { useState } from "react"
import TabNav from "../components/TabNav"
import forms from "../config/forms"
import Link from "next/link"
import s from "../styles/Filters.module.scss"

interface Props {
  workflows: WorkflowWithExtras[]
  resident?: Resident
}

const IndexPage = ({ workflows, resident }: Props): React.ReactElement => {
  const [search, setSearch] = useState<string>("")

  return (
    <Layout title="Dashboard">
      <h1 className="govuk-visually-hidden">Dashboard</h1>
      {/* <h2>{resident ? prettyResidentName(resident) : "Work in progress"}</h2> */}

      <div className={s.filters}>
        <SearchBox
          searchQuery={search}
          setSearchQuery={setSearch}
          label="Foo"
        />

        <div className="govuk-form-group lbh-form-group">
          <label className="govuk-visually-hidden" htmlFor="filter-status">
            Filter by status
          </label>
          <select
            className="govuk-select lbh-select"
            id="filter-status"
            name="filter-status"
          >
            <option value="">All statuses</option>
            {Object.keys(Status).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="govuk-form-group lbh-form-group">
          <label className="govuk-visually-hidden" htmlFor="filter-type">
            Filter by type
          </label>
          <select
            className="govuk-select lbh-select"
            id="filter-type"
            name="filter-type"
          >
            <option value="">All types</option>
            {forms.map(form => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>

        <div className="govuk-checkboxes lbh-checkboxes">
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="only-reviews-reassessments"
              name="only-reviews-reassessments"
              type="checkbox"
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="only-reviews-reassessments"
            >
              Only show reviews and reassessments
            </label>
          </div>
        </div>
      </div>

      <WorkflowList workflows={workflows} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async req => {
  const { social_care_id } = req.query

  const workflows = await getWorkflows(social_care_id as string)

  let resident = null
  if (social_care_id) {
    resident = await getResidentById(social_care_id as string)
  }

  return {
    props: {
      workflows: JSON.parse(JSON.stringify(workflows)),
      resident,
    },
  }
}

export default IndexPage
