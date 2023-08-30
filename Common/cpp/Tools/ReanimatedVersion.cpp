#include "ReanimatedVersion.h"
#include <regex>
#include <string>

#ifdef REANIMATED_VERSION
#define STRINGIZE(x) #x
#define STRINGIZE2(x) STRINGIZE(x)
#define REANIMATED_VERSION_STRING STRINGIZE2(REANIMATED_VERSION)
#endif // REANIMATED_VERSION

using namespace facebook;

namespace reanimated {

std::string getReanimatedCppVersion() {
  return std::string(REANIMATED_VERSION_STRING);
}

// This function is pretty much a copy of
// `src/reanimated2/platform-specific/checkVersion.ts`.
bool matchVersion(const std::string &version1, const std::string &version2) {
  std::regex pattern("^\\d+\\.\\d+\\.\\d+$");
  if (std::regex_match(version1, pattern) &&
      std::regex_match(version2, pattern)) {
    auto major1 = std::regex_search(version1, std::regex("^\\d+"));
    auto major2 = std::regex_search(version2, std::regex("^\\d+"));
    if (major1 != major2) {
      return false;
    }
    auto minor1 = std::regex_search(version1, std::regex("\\.\\d+\\."));
    auto minor2 = std::regex_search(version2, std::regex("\\.\\d+\\."));
    if (minor1 != minor2) {
      return false;
    }
    return true;
  } else {
    return version1 == version2;
  }
}

void checkJSVersion(jsi::Runtime &rnRuntime) {
  auto cppVersion = getReanimatedCppVersion();

  auto maybeJSVersion =
      rnRuntime.global().getProperty(rnRuntime, "_REANIMATED_VERSION_JS");
  if (maybeJSVersion.isUndefined()) {
    throw std::runtime_error(
        std::string(
            "[Reanimated] C++ side failed to resolve JavaScript code version\n") +
        "See `https://docs.swmansion.com/react-native-reanimated/docs/guides/Troubleshooting#c-side-failed-to-resolve-javascript-code-version` for more details.");
  }

  auto jsVersion = maybeJSVersion.asString(rnRuntime).utf8(rnRuntime);

  if (!matchVersion(cppVersion, jsVersion)) {
    throw std::runtime_error(
        std::string(
            "[Reanimated] Mismatch between C++ code version and JavaScript code version (") +
        cppVersion + " vs. " + jsVersion + " respectively).\n" +
        "See `https://docs.swmansion.com/react-native-reanimated/docs/guides/Troubleshooting#mismatch-between-c-code-version-and-javascript-code-version` for more details.");
  }

  rnRuntime.global().setProperty(
      rnRuntime,
      "_REANIMATED_VERSION_CPP",
      jsi::String::createFromUtf8(rnRuntime, cppVersion));
}

}; // namespace reanimated
