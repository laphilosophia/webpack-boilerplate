import MicroModal, { MicroModalConfig } from 'micromodal';

export default (config?: MicroModalConfig) => {
  MicroModal.init(config ? config : {});

  const init = (config?: MicroModalConfig | undefined) => MicroModal.init(config);
  const show = (targetModal: string, config?: MicroModalConfig | undefined) => MicroModal.show(targetModal, config);
  const close = (targetModal?: string) => MicroModal.close(targetModal);

  return {
    init: init,
    show: show,
    close: close
  }
}
