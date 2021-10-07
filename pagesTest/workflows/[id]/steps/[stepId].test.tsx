import { GetServerSidePropsContext } from "next"
import { allSteps } from "../../../../config/forms"
import { mockResident } from "../../../../fixtures/residents"
import { mockWorkflow } from "../../../../fixtures/workflows"
import { ParsedUrlQuery } from "querystring"
import { getResidentById } from "../../../../lib/residents"
import { mockForm } from "../../../../fixtures/form"
import { getServerSideProps } from "../../../../pages/workflows/[id]/steps/[stepId]"
import cookie from "cookie"
import jwt from "jsonwebtoken"
import { pilotGroup } from "../../../../config/allowedGroups"

process.env.GSSO_TOKEN_NAME = "foo"
process.env.HACKNEY_JWT_SECRET = "secret"

jest.mock("../../../../lib/prisma", () => ({
  workflow: {
    findUnique: jest.fn().mockResolvedValue(mockWorkflow),
  },
}))

jest.mock("../../../../lib/residents")
;(getResidentById as jest.Mock).mockResolvedValue(mockResident)

describe("getServerSideProps", () => {
  it("returns the workflow and all steps for forms as props", async () => {
    const response = await getServerSideProps({
      query: {
        id: mockWorkflow.id,
        stepId: mockForm.themes[0].steps[0].id,
      } as ParsedUrlQuery,
      req: {
        headers: {
          referer: "http://example.com",
          cookie: cookie.serialize(
            process.env.GSSO_TOKEN_NAME,
            jwt.sign(
              {
                groups: [pilotGroup],
              },
              process.env.HACKNEY_JWT_SECRET
            )
          ),
        },
      },
    } as GetServerSidePropsContext)

    expect(response).toHaveProperty(
      "props",
      expect.objectContaining({
        workflow: mockWorkflow,
        allSteps: await allSteps(),
      })
    )
  })

  it("redirects back if user is not in pilot group", async () => {
    const response = await getServerSideProps({
      query: {
        id: mockWorkflow.id,
        stepId: mockForm.themes[0].steps[0].id,
      } as ParsedUrlQuery,
      req: {
        headers: {
          referer: "http://example.com",
          cookie: cookie.serialize(
            process.env.GSSO_TOKEN_NAME,
            jwt.sign(
              {
                groups: ["some-non-pilot-group"],
              },
              process.env.HACKNEY_JWT_SECRET
            )
          ),
        },
      },
    } as GetServerSidePropsContext)

    expect(response).toHaveProperty("redirect", {
      destination: "http://example.com",
    })
  })

  it("redirects back to if user is not in pilot group and no referer", async () => {
    const response = await getServerSideProps({
      query: {
        id: mockWorkflow.id,
        stepId: mockForm.themes[0].steps[0].id,
      } as ParsedUrlQuery,
      req: {
        headers: {
          cookie: cookie.serialize(
            process.env.GSSO_TOKEN_NAME,
            jwt.sign(
              {
                groups: ["some-non-pilot-group"],
              },
              process.env.HACKNEY_JWT_SECRET
            )
          ),
        },
      },
    } as GetServerSidePropsContext)

    expect(response).toHaveProperty("redirect", {
      destination: "/",
    })
  })
})
