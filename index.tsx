const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props);
    }

    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const render = (reactElementOrText, container) => {
  if (
    typeof reactElementOrText === "string" ||
    typeof reactElementOrText === "number"
  ) {
    container.appendChild(
      document.createTextNode(reactElementOrText.toString())
    );
    return;
  }

  const actualDomElement = document.createElement(reactElementOrText.tag);
  if (reactElementOrText.props) {
    Object.keys(reactElementOrText.props)
      .filter((p) => p !== "children")
      .forEach((p) => (actualDomElement[p] = reactElementOrText.props[p]));
  }
  if (reactElementOrText.props.children) {
    reactElementOrText.props.children.forEach((child) =>
      render(child, actualDomElement)
    );
  }
  container.appendChild(actualDomElement);
};

const rerender = () => {
  stateCursor = 0;
  document.getElementById("app").firstChild.remove();
  render(<App />, document.getElementById("app"));
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const FROZEN_CURSOR = stateCursor;
  states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialState;

  let setState = (newState) => {
    states[FROZEN_CURSOR] = newState;
    console.log("states", states);
    rerender();
  };

  stateCursor++;

  return [states[FROZEN_CURSOR], setState];
};

const App = () => {
  const [name, setName] = useState("Kiana");
  const [count, setCount] = useState(0);

  return (
    <div className="foo-class">
      <h1>Hello, {name}</h1>
      <input
        type="text"
        placeholder="name..."
        value={name}
        onchange={(e) => {
          setName(e.target.value);
        }}
      />

      <h2>The count is: {count}</h2>
      <button
        onclick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
      <button
        onclick={() => {
          setCount(count - 1);
        }}
      >
        -
      </button>
    </div>
  );
};

render(<App />, document.getElementById("app"));
