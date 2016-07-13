Template.signaturePad.onRendered(() => {
  wrapper = document.getElementById('signature-pad');
  canvas = wrapper.querySelector('canvas');

  window.onresize = SignaturePadConfig.resizeCanvas;
  SignaturePadConfig.resizeCanvas();

  const signaturePad = new SignaturePad(canvas);

  Router.current().params.signaturePad = signaturePad;
});

Template.signaturePad.events(
  {
    'click .js-sign-clear': (event) => {
      event.preventDefault();
      const signaturePad = Router.current().params.signaturePad;
      signaturePad.clear();
    },
  }
);
