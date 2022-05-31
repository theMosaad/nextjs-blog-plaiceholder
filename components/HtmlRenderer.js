import Image from "next/image";
import Link from "next/link";
import * as React from "react";

const getComponent = (node) => {
  if (node.type === "root") {
    return ({ children }) => <>{children}</>;
  }

  if (node.type === "text") {
    return ({ value }) => <>{value}</>;
  }

  if (node.tagName === "p") {
    return ({ children }) => <p>{children}</p>;
  }

  if (node.tagName === "br") {
    return () => <br />;
  }

  if (node.tagName === "img") {
    return ({ properties }) => (
      <span
        style={{
          display: "block",
          maxWidth: `${properties.width}px`,
        }}
      >
        <Image
          alt={properties.alt}
          blurDataURL={properties.blurDataURL}
          height={properties.height}
          layout="responsive"
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 1024px"
          src={properties.src}
          width={properties.width}
        />
      </span>
    );
  }

  if (node.tagName === "a") {
    const { href } = node.properties;
    const isInternalLink =
      href && (href.startsWith("/") || href.startsWith("#"));

    if (isInternalLink) {
      return ({ children }) => (
        <Link href={href}>
          <a>{children}</a>
        </Link>
      );
    }
    return ({ children }) => (
      <a href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  if (node.tagName) {
    return ({ children, properties }) =>
      React.createElement(
        node.tagName,
        {
          ...properties,
          style: null,
        },
        children
      );
  }

  throw new Error("Unhandled node", node);
};

const Node = (node) => {
  const Component = getComponent(node);
  const { children } = node;

  return children ? (
    <Component {...node}>
      {children.map((child, index) => (
        <Node key={index} {...child} />
      ))}
    </Component>
  ) : (
    <Component {...node} />
  );
};

export const HtmlRenderer = ({ source }) => <Node {...source} />;
