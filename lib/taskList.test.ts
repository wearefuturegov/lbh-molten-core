import { mockWorkflow } from "../fixtures/workflows"
import { baseAssessment, wrapUp } from "../config/forms"

import {
  buildThemes,
  completeness,
  groupAnswersByTheme,
  totalStepsFromThemes,
} from "./taskList"
import { mockRevision } from "../fixtures/revisions"

describe("groupAnswersByTheme", () => {
  it("correctly groups a valid set of answers", () => {
    const result = groupAnswersByTheme({
      "Contingency plan": {},
      "Hearing impairment": {},
      Eyesight: {},
    })
    expect(result).toStrictEqual({
      "Carer's assessment": {
        "Contingency plan": {},
      },
      "Sensory assessment": {
        "Hearing impairment": {},
        Eyesight: {},
      },
    })
  })

  it("gracefully handles steps without a matching theme", () => {
    const result = groupAnswersByTheme({
      foo: {},
      bar: {},
    })
    expect(result).toStrictEqual({})
  })
})

describe("totalStepsFromThemes", () => {
  it("correctly gives the total number of steps for a basic assessment", () => {
    const result = totalStepsFromThemes(buildThemes(mockWorkflow))
    expect(result).toBe(17)
  })

  it("correctly gives the total number of steps for an assessment with elements", () => {
    const result = totalStepsFromThemes(
      buildThemes({
        ...mockWorkflow,
        assessmentElements: ["Carer's assessment"],
      })
    )
    expect(result).toBe(19)
  })

  it("fails gracefully", () => {
    const result = totalStepsFromThemes([])
    expect(result).toBeFalsy()
  })
})

describe("completeness", () => {
  it("gives 0 for a brand new workflow", () => {
    const result = completeness(mockWorkflow)
    expect(result).toBe(0)
  })

  it("gives the correct value for an in progress workflow", () => {
    const result = completeness({
      ...mockWorkflow,
      answers: {
        foo: {},
        bar: {},
      },
    })
    expect(result).toBeLessThanOrEqual(0.5)
  })

  it("can compare revisions", () => {
    const result = completeness(mockWorkflow, {
      ...mockRevision,
      answers: {
        foo: {},
      },
    })
    expect(result).toBeLessThanOrEqual(0.5)
  })
})
