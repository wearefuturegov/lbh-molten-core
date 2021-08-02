import useWarnUnsavedChanges from "./useWarnUnsavedChanges"
import { render } from "@testing-library/react"
import { useRouter } from "next/router"
import { act } from "react-dom/test-utils"

window.confirm = jest.fn()

jest.mock("next/router")

let routeChangeHandler
;(useRouter as jest.Mock).mockImplementation(() => {
  return {
    events: {
      on: jest.fn((event, callback) => {
        routeChangeHandler = callback
      }),
      off: jest.fn(),
    },
  }
})

const MockComponent = ({ unsavedChanges }: { unsavedChanges: boolean }) => {
  useWarnUnsavedChanges(unsavedChanges)
  return null
}

// these tests don't look perfect, but testing for a thrown error gets very complicated very quickly
// next doesn't have a good way to abort/cancel a pending route change without throwing an error
describe("useWarnUnsavedChanges", () => {
  it("does nothing when there are no unsaved changes", () => {
    expect(() => {
      render(<MockComponent unsavedChanges={false} />)
      routeChangeStart()
    }).not.toThrow()
  })

  it("can cancel routing when there are unsaved changes", () => {
    expect(() => {
      render(<MockComponent unsavedChanges={true} />)
      routeChangeStart()
    }).toThrow("routeChange aborted")
  })

  it("can show a confirmation warning", () => {
    try {
      render(<MockComponent unsavedChanges={true} />)
      routeChangeStart()
    } catch (e) {
      null
    }
    expect(window.confirm).toBeCalled()
  })
})
