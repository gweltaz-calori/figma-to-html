<template>
  <div class="home">
    <figma-title color="white">Figma html</figma-title>
    <p class="description">The easiest way to convert figma files into html</p>
    <figma-button-input
      :valid="fileValid"
      @clearError="fileValid = true"
      v-model="figmaFileUrl"
      @onButtonClicked="validateFigmaUrl"
      class="file-input"
      placeholder="File url"
    ></figma-button-input>
    <!-- <span v-if="!user.access_token" class="oauth-text">Or use <a class="oauth-text-link " href="/api/auth">Oauth</a></span> -->
  </div>
</template>
<script>
import FigmaButtonInput from "@/components/Common/FigmaButtonInput.vue";
import FigmaButton from "@/components/Common/FigmaButton.vue";
import FigmaTitle from "@/components/Common/FigmaTitle.vue";
import FigmaAlert from "@/components/Common/FigmaAlert.vue";
import FigmaAlertActions from "@/components/Common/FigmaAlertActions.vue";
import FigmaAlertContent from "@/components/Common/FigmaAlertContent.vue";
import FigmaAlertHeader from "@/components/Common/FigmaAlertHeader.vue";

const FIGMA_URL_REGEX = /https:\/\/([w\.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/;

import { mapGetters } from "vuex";
import { getFile } from "@/api";
import Importer from "../../importer/Importer";

import JSZip from "jszip";

const zip = new JSZip();

export default {
  components: {
    FigmaButtonInput,
    FigmaButton,
    FigmaTitle,
    FigmaAlert,
    FigmaAlertActions,
    FigmaAlertContent,
    FigmaAlertHeader
  },
  data() {
    return {
      figmaFileUrl: "",
      fileId: "",
      fileValid: true
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    async validateFigmaUrl() {
      let matches = this.figmaFileUrl.match(FIGMA_URL_REGEX);
      if (!matches) {
        //todo show error component
        this.fileValid = false;
        return;
      }
      this.fileId = matches[3];

      this.getFrames();
    },
    async getFrames() {
      const { project, images } = await getFile(this.fileId);
      let index = 0;
      let canvas = Importer.loadPage(project, 0, images);
      for (let frame of canvas.children) {
        zip.file(`frame_${index}.html`, frame.draw().outerHTML);
        index++;
      }

      const content = await zip.generateAsync({ type: "uint8array" });
      const file = new Blob([content], { type: "application/zip" });
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = `${this.fileId}.zip`;
      a.click();
      zip.files = {};
    }
  }
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  background: linear-gradient(180deg, #5bd4ea 0%, #1251ed 100%);
}

.description {
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  font-size: 13px;
  text-align: center;

  color: rgba(255, 255, 255, 0.57);
}

.file-input {
  margin-top: 37px;
}

.mask-helper {
  width: 280px;

  font-family: Exo;
  font-style: normal;
  font-weight: 500;

  line-height: normal;
  font-size: 12px;

  color: #2d1bff;
}

.mask-icon {
  margin-right: 10px;
}

.oauth-text {
  margin-top: 11px;
}

.oauth-text,
.oauth-text-link {
  font-family: Exo;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  font-size: 12px;
  text-align: center;

  color: #ffffff;
}

.oauth-text-link {
  text-decoration: none;
  font-weight: 600;
}

.profile {
  position: absolute;
  top: 55px;
  right: 55px;
}
</style>
