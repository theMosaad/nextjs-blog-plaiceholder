import markdownStyles from "./markdown-styles.module.css";
import { HtmlRenderer } from "./HtmlRenderer";

export default function PostBody({ content }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        // dangerouslySetInnerHTML={{ __html: content }}
      >
        <HtmlRenderer source={content} />
      </div>
    </div>
  );
}
