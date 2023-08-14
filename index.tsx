const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          cacheStore.set(key, data);
          rerender();
        });
        return { tag: "h1", props: { children: ["I'm loading..."] } };
      }
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

const cacheStore = new Map();
const createResource = (promise, key) => {
  if (cacheStore.has(key)) {
    return cacheStore.get(key);
  } else {
    throw { promise, key };
  }
};

const App = () => {
  const [name, setName] = useState("Kiana");
  const [count, setCount] = useState(0);
  const imgSrc = createResource(loadImageSrc(), "dota2-image");

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

      <img src={imgSrc} />
    </div>
  );
};

async function loadImageSrc() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "https://e1.pxfuel.com/desktop-wallpaper/363/993/desktop-wallpaper-inspirational-3d-live-for-dota-2-android-apps-on-google-dota-3d.jpg"
      );
    }, 1000);
  });
}

render(<App />, document.getElementById("app"));
