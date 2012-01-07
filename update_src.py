import os;
import shutil;

proj = {
    "darken": [],
    "eye_saver": [
        "com/zuki/common",
    ],
    "re_color_it": [],
    "tab_shooter": [
        "com/zuki/chrome"
    ]
};

if __name__ == "__main__":
    # get current working directory
    p = os.path.dirname(os.path.abspath(__file__));

    for k, v in proj.items():
        # target path
        t = os.path.join(p, "ext");
        t = os.path.join(t, k);

        try:
            shutil.rmtree(os.path.join(t, "com"));
        except OSError as e:
            print("no such file: " + os.path.join(t, "com"));

        for vv in v:
            # source path
            s = os.path.join(p, "src");
            s = os.path.join(s, vv);
            # extract directory path
            d = os.path.join(t, vv);
            shutil.copytree(s, d);

