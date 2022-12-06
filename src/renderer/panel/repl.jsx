import { ReactReplView } from "awesome-react-repl"

const GeneralPurposeReplUI = () => {
  return (
    <ReactReplView
      title={`My Awesome Repl!`}
      // tabs={["Javascript", "Python"]}
      // selectedTab="Javascript"
      // onChangeTab={action("onChangeTab")}
      onSubmit={action("onSubmit")}
      onClear={action("onClear")}
      height={200}
      lines={[
        { type: "input", value: "obj = { something: 2 }" },
        { type: "output", value: '{ "something": 2 }' },
        { type: "input", value: "b" },
        { type: "error", value: "TypeError: b is not defined" },
      ]}
    />
  )
}